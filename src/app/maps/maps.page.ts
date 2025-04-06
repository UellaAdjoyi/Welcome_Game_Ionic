import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { EventServiceService } from '../services/event-service.service';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit, OnDestroy {
  userMarker: L.Marker | undefined;
  userCoords: [number, number] = [0, 0]; // Initialisation des coordonnées de l'utilisateur
  map: L.Map | undefined;
  hasCreationPermissions: boolean = false;
  userPoints: number = 0;
  events: any[] = [];
  eventId!: number;
  private pointsSubscription: Subscription | undefined;

  constructor(
    private eventService: EventServiceService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.getProfile().subscribe(
      (user) => {
        // console.log('User profile loaded:', user);
        this.hasCreationPermissions = user.role === 'admin';
        if (!this.hasCreationPermissions || this.hasCreationPermissions) {
          this.subscribeToPoints();
          this.eventService.updateUserPoints();
        }
      },

      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  async loadEvents(userCoords: [number, number]) {
    try {
      const events = await this.eventService
        .getNearbyEvents(userCoords[0], userCoords[1], 500)
        .toPromise();

      if (!events || events.length === 0) {
        const noEventsToast = await this.toastController.create({
          message: 'No events found nearby.',
          duration: 3000,
          color: 'warning',
        });
        await noEventsToast.present();
        return;
      }

      events
        .filter(
          (event: any) =>
            event.latitude !== null &&
            event.longitude !== null &&
            event.radius !== null
        )
        .forEach((event: any, index: number) => {
          const offset = index * 0.0001; // Adjust positioning to avoid overlap
          const eventCoords: [number, number] = [
            event.latitude + offset,
            event.longitude + offset,
          ];
          console.log('Adding event to map:', eventCoords);

          L.circle(eventCoords, {
            color: 'green',
            fillColor: '#F82807FF',
            fillOpacity: 0.5,
            radius: event.radius,
          })
            .addTo(this.map!)
            .bindPopup(
              this.hasCreationPermissions
                ? `
              <strong>${event.name}</strong><br>
              <ion-button id="edit-btn-${event.id}">Edit</ion-button>
              <ion-button id="join-btn-${event.id}">Join</ion-button>

            `
                : `
              <strong>${event.name}</strong><br>
              <ion-button id="join-btn-${event.id}">Join</ion-button>
            `
            )
            .on('popupopen', () => {
              if (this.hasCreationPermissions) {
                document
                  .getElementById(`edit-btn-${event.id}`)
                  ?.addEventListener('click', () => {
                    this.presentUpdateEventPopup(event);
                  });
              } else {
                document
                  .getElementById(`join-btn-${event.id}`)
                  ?.addEventListener('click', () => {
                    this.joinEvent(event);
                  });
              }
            });
        });
    } catch (error) {
      console.error('Error loading events:', error);

      const errorToast = await this.toastController.create({
        message: 'Unable to  load nearby events. Please try again.',
        duration: 5000,
        color: 'danger',
      });
      await errorToast.present();
    }
  }

  async showNoEventsAlert() {
    const alert = await this.alertController.create({
      header: 'no nearby events',
      message: 'There are no nearby events.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  loadMap() {
    const belfortCoords: [number, number] = [47.637, 6.862]; // Coordonnées du territoire de Belfort
    const zoomLevel: number = 18;

    this.map = L.map('map', {
      center: belfortCoords, // Belfort Card
      zoom: zoomLevel,
    });

    //  OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;

      this.onMapClick(lat, lng);
    });
    this.trackUserPosition();
  }

  trackUserPosition() {
    const zoomLevel = 15;

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        this.userCoords = [position.coords.latitude, position.coords.longitude];

        if (this.map) {
          if (this.userMarker) {
            this.userMarker.setLatLng(this.userCoords);
          } else {
            this.userMarker = L.marker(this.userCoords, {
              icon: L.icon({
                iconUrl:
                  'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              }),
            })
              .addTo(this.map)
              .bindPopup('Your position.');
          }

          this.map.setView(this.userCoords, zoomLevel);

          // Charger les événements uniquement si c'est la première localisation ou si la position a changé significativement
          this.loadEvents(this.userCoords);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        this.displayGeolocationError(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  }

  async displayGeolocationError(error: GeolocationPositionError) {
    let message = '';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission was denied. Please enable it.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      default:
        message = 'An unknown error occurred.';
        break;
    }

    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
    });
    await toast.present();
  }

  joinEvent(event: any) {
    console.log(`You have join the event : ${event.name}`);

    this.eventService.joinEvent(event.id).subscribe(
      (response) => {
        console.log(response.message);
        alert(response.message);

        this.eventService.updateUserPoints();
      },
      (error) => {
        console.error('Error joining the event :', error);
        alert("You didn't join the event!.");
      }
    );
  }

  ionViewDidLeave() {
    if (this.map) {
      this.map.remove();
    }
  }

  loadUserPoints() {
    this.eventService.getUserPoints().subscribe(
      (data) => {
        this.userPoints = data.user_points;
      },
      (error) => {
        console.error('Cant find points:', error);
      }
    );
  }

  subscribeToPoints() {
    this.pointsSubscription = this.eventService
      .getPointsObservable()
      .subscribe((points) => {
        this.userPoints = points;
      });
  }

  ngOnDestroy() {
    if (this.pointsSubscription) {
      this.pointsSubscription.unsubscribe();
    }
  }

  onMapClick(lat: number, lng: number) {
    if (this.hasCreationPermissions) {
      this.presentCreateEventPopup(lat, lng);
    } else {
      console.log("Vous n'êtes pas autorisé à créer des événements.");
    }
  }

  async presentCreateEventPopup(lat: number, lng: number) {
    const alert = await this.alertController.create({
      header: 'Add event',
      cssClass: 'create-event-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Event name',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
        },
        {
          name: 'startDate',
          type: 'date',
          placeholder: 'Start time',
        },
        {
          name: 'endDate',
          type: 'date',
          placeholder: 'End time',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Creation cancelled'),
        },
        {
          text: 'Create',
          handler: async (data) => {
            if (!data.name || !data.startDate || !data.endDate) {
              console.log('All fields are required.');
              const missingFieldsToast = await this.toastController.create({
                message: 'All fields are required.',
                duration: 2000,
                color: 'warning',
              });
              await missingFieldsToast.present();
              return false;
            }
            if (new Date(data.startDate) > new Date(data.endDate)) {
              console.log('Start date must be before end date.');
              const invalidDatesToast = await this.toastController.create({
                message: 'Start date must be before end date.',
                duration: 3000,
                color: 'danger',
              });
              await invalidDatesToast.present();
              return false;
            }
            try {
              await this.createEvent(data, lat, lng);
              const successToast = await this.toastController.create({
                message: 'Event created successfully!',
                duration: 5000,
                color: 'success',
              });
              await successToast.present();
              return true;
              this.loadEvents(this.userCoords);
            } catch (error) {
              console.error('Error creating event:', error);

              // Toast d'erreur
              const errorToast = await this.toastController.create({
                message:
                  'An error occurred while creating the event. Please try again.',
                duration: 5000,
                color: 'danger',
              });
              await errorToast.present();
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  createEvent(data: any, lat: number, lng: number) {
    const eventData = {
      name: data.name,
      description: data.description,
      start_time: data.startDate,
      end_time: data.endDate,
      latitude: lat,
      longitude: lng,
    };
    this.eventService.createEvent(eventData).subscribe(
      (response) => {
        console.log('Event created successfully:', response);
      },
      (error) => {
        console.error('Error creating event:', error);
      }
    );
  }

  async presentUpdateEventPopup(event: any) {
    const alert = await this.alertController.create({
      header: 'Update or delete the event',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Event name',
          value: event.name,
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: event.description,
        },
        {
          name: 'startDate',
          type: 'date',
          placeholder: 'Start date',
          value: event.start_date,
        },
        {
          name: 'endDate',
          type: 'date',
          placeholder: 'End date',
          value: event.end_date,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            const updatedEvent = {
              id: event.id,
              name: data.name,
              description: data.description,
              start_time: data.startDate,
              end_time: data.endDate,
            };

            this.eventService.updateEvent(updatedEvent).subscribe(
              (response) => {
                console.log('Event updated successfully:', response);
              },
              (error) => {
                console.error('Error updating event:', error);
              }
            );
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteEvent(event);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteEvent(event: any) {
    console.log('Event to delete:', event);
    if (!event.id) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: `Do you want to delete the event "${event.name}" ?`,

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.eventService.deleteEvent(event.id).subscribe({
              next: () => {
                console.log('Event deleted');
                this.events = this.events.filter((e) => e.id !== event.id);
              },
              error: (error) => {
                console.error('Erreur lors de la suppression:', error);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
