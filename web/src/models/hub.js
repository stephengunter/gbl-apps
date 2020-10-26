import * as signalR from '@microsoft/signalr';
import { NOTIFICATIONS } from '@/store/actions.type';
import { API_URL } from '@/config';

const EventEmitter = require('events');

class Hub extends EventEmitter {
   constructor(user) {
      super();
      this._user = user;
      
      let url = `${API_URL}/notifications?user=${user.id}`;
      this._connection = new signalR.HubConnectionBuilder()
                        .withUrl(url)
                        .withAutomaticReconnect().build();
      
      
      this._connection.on(NOTIFICATIONS, (userId) => {
         if(userId == this._user.id) this.emit(NOTIFICATIONS);
      });

      this._connState = {
         connecting: 0,
         connected: 1,
         reconnecting: 2,
         disconnected: 4
      }

      this.connect();
   }

   connect() {
      console.log('connect state', this._connection.state);
      if(this._connection.state !== this._connState.connected){
         this._connection.start()
         .then(() => {
            this.init();
         })
         .catch(error => {
            console.log(error);
         });
      }

      
   }

   init() {
      this._connection.invoke('init').then(id => {
         this._id = id;
      })
      .catch(error => {
         console.log(error);
      });
   }

   disconnect() {
      this._connection.stop()
      .catch(error => {
         console.log(error);
      });
   }


   
   
}


export default Hub;