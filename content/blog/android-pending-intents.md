---
title: "Android: Pending Intents"
date: 2017-04-03
status: publish
permalink: /android-pending-intents
author: "Brad Cypert"
type: blog
id: 50
category:
  - Android
tags:
  - android
  - intents
description:
  - "Pending Intents in Android allow you to wrap an existing intent and keep that around even if the application process is killed."
---

So you’ve been working with Android for weeks now, and you’ve all but mastered the ability to start a new activity with an intent. Here’s the kicker – There’s far more to Intents than starting a new activity when a user clicks a button, and today I’ll share my knowledge of pending intents.

**Note: This is an abstract piece on pending intents. Code is minimal to show the essential pieces of pending intents and provide clarity on what they do. This code is not copy/paste friendly nor will we be building an entire application.**

#### So what is a pending intent?

When you create an intent in your application, you’re creating a message to the android phone. You can specify the activity that it’s supposed to create, or the intention of the intent (see what I did there?). Some examples of this are creating an intent to “Send an SMS Message” or to “Add a calendar event”. Once the intent is triggered, the Android OS takes a look at it and decides what to do. Intents are a great way to communicate between applications.

A pending intent is a special type of intent. It wraps an existing intent and has a few extra goodies attached to it. The most important difference between a pending intent and a regular intent is this – even if the application process is killed, the pending intent is still around for other applications or processes to interact with it. Due to this, you can give another process a reference to your application via a pending intent, and that pending intent may (or may not be) executed by that process.



#### Alright, but I’m still confused.

Here’s a more concrete example. I’ve been working on an SMS Messenger to replace the default one on my phone. As any good app developer, I want to leverage Android OS Notifications to let my users know when they’ve received a new message. As a good app developer with higher standards, I want them to be able to tap that notification and be brought to the message. This is where the pending intent comes in. I can create a new pending intent that points to my “SMS Message View” activity with the intent information preconfigured. Here’s some code to help you see what I mean. This is the activity that my pending intent is targeting:

```java
public class ConversationDetails extends AppCompatActivity {
    public static final String KEY="id";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_conversation_details);

        Context context = getApplicationContext();
        CharSequence text = "Hello toast!";
        int duration = Toast.LENGTH_SHORT;

        Toast toast = Toast.makeText(context, getKeyFromIntent(false), duration);
        toast.show();
    }

    private String getKeyFromIntent(boolean filter) {
        Intent intent = getIntent();
        if (filter) return intent.getStringExtra(KEY).replaceAll("[\D]","");
        else return intent.getStringExtra(KEY);
    }
}
```

There’s nothing crazy here. This activity retrieves a value that is expected to exist on the intent that created this activity and then creates a small toast notification for it. Simple, but all we need to demonstrate how this all fits together.

Now, we’re going to create a class that extends BroadcastReceiver. The point of this class is to listen to incoming SMS messages and create our notifications.

```java
public class SmsListener extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        //Check to see if this is a received SMS
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            //Gets the message from the incoming intent
            for (SmsMessage smsMessage : Telephony.Sms.Intents.getMessagesFromIntent(intent)) {
                String messageBody = smsMessage.getMessageBody();
                String phoneNumber = smsMessage.getDisplayOriginatingAddress();
                Contact contact = ContactsService.getContactForNumber(context.getContentResolver(), phoneNumber);
                long dateTime = smsMessage.getTimestampMillis();

                //Start building a new notification
                Notification.Builder mBuilder = new Notification.Builder(context)
                        .setSmallIcon(R.mipmap.empty_portait)
                        .setContentTitle(phoneNumber)
                        .setContentText(messageBody);

                if (contact.getPicUri() != null) {
                    Icon icon = Icon.createWithContentUri(Uri.parse(contact.getPicUri()));
                    mBuilder.setSmallIcon(icon);
                }

                if (contact.getName() != null) {
                    mBuilder.setContentTitle(contact.getName());
                }

                //Create a new intent for our application to open the above activity
                Intent openIntent = new Intent(context, ConversationDetails.class);
                //Add the phone number, the above activity needs it
                openIntent.putExtra(ConversationDetails.KEY, phoneNumber);
                //Wrap the intent with a pending intent
                PendingIntent pendingIntent = PendingIntent.getActivity(context, 12345, openIntent, PendingIntent.FLAG_ONE_SHOT);
                //Set the intent of the notification
                mBuilder.setContentIntent(pendingIntent);

                NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                nm.notify(0, mBuilder.build());
            }
        }
    }
}

```

Alright, what a class. Let’s talk this through line by line. First, we’re extending the BroadcastReceiver from the Android API. This allows us to register this receiver with the OS and have it handle incoming SMS messages (this is done in the manifest). Then we implement our onReceive method. This is called when an intent is triggered that informs the Android OS that it has a new SMS message. We do some logic regarding the Android Telefony API. I won’t go too in depth into that, just know that we’re getting an SMS that gets passed along with the intent and then creating a notification based off of it’s data. You’ll notice that we’re also creating a regular intent. That’s because a pending intent wraps a regular intent.

Then we create our pending intent via `PendingIntent.getActivity`. Why not use a constructor? Well, pending intent doesn’t have one! Instead, we use `PendingIntent.getActivity` and pass in the context. This allows the pending intent to operate as this context (so if another application like the NotificationManager handles this intent, they can act with the permissions of our application). The next parameter is a number. For demo purposes, I’ve used `12345`. This number can be treated like an ID for the pending intent. The idea is that you can lookup pending intents by this ID or create a new one with this ID to overwrite it. It’s up to you to decide if you really need a unique ID or if you can just use one preset number for your application. Next, we pass in our intent that we created above and lastly we pass in a `PendingIntent` status flag. This is used to determine how the intent should behave and how the application should sit on the view stack. In this case, we’re creating a `ONE_SHOT` so pressing the back button from this application will take you back to whatever other application you had opened before clicking the notification.

Lastly, you’ll notice how this all fits together. The notification manager has a `.setContentIntent` method. This, however, does not take an intent and instead takes in `PendingIntent` and we pass our newly created pending intent to it here before notifying the `NotificationManager` that we have a new notification. If you tap this notification on the phone, you’ll be taken to the `ConversationDetails` view with the appropriate conversation loaded up.

#### Wrapping up

And there you have it. A simple example on how and when to use pending intents. Remember: A pending intent is something you can give another application or process to act on behalf of your application. How are you using pending intents in your applications? Let me know below!
