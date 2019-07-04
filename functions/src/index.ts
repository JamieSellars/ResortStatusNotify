import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Initialise database connection
 */
admin.initializeApp(functions.config().firebase);

/**
 * 
 *  On user creation
 * 
 */
exports.userOnCreate = functions.auth.user()
.onCreate((user: admin.auth.UserRecord, context: functions.EventContext) => {    

    // Reference to write to
    return admin.database().ref(`/users/${user.uid}/`).set({
        'displayName': user.displayName,
        'subscriptions': '',
        'fcmTokens': ''
    });

});


exports.liftStatusOnUpdate = functions.database.ref('/liftstatus/{status}')
.onUpdate((snapshotChanges, context) =>{

    const before = snapshotChanges.before.val();
    const after = snapshotChanges.after.val();

    // Ignore no changes
    if( before.status == after.status )
        return null;

    // Ignore closures
    if( after.status == 'Closed')
        return null;

    const liftId = after.id;

    console.log(`${liftId} status has changed to open`);

    const message: string = `${after.name} has just opened`;

    // Get a list of users subscripting to lift id
    return admin.database().ref('/users').once('value').then((users)=>{

        const userArray = users.val();
        
        const subscribers: string[] = [];
        Object.keys(userArray).forEach((key: string) => {
    
            const subscriptions = userArray[key].subscriptions;
        
            for(let i = 0; i < subscriptions.length; i++)    
              if( subscriptions[i].id == liftId ){
                Object.keys(userArray[key].fcmTokens).forEach((tokenKey)=>{
                  subscribers.push(userArray[key].fcmTokens[tokenKey]);
                });
              }      
                
        });
        
        console.log('send notification');
        sendNotification(subscribers, message);
    
    }).catch((err)=>{console.error(err)});
  
});

const sendNotification = (tokens: string[], message: string) => {

    const payload: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
            body: message        
        }
    }

    admin.messaging().sendMulticast(payload).then((res)=>{
        console.log('notifications sent to subscribers');
    }).catch((err) =>{
        console.error(err);
    })

}
