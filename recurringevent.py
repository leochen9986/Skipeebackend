from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timedelta
import pytz

# Connect to MongoDB
client = MongoClient('mongodb+srv://tanaydeo388:uHaD4mQi0UC4wEfY@cluster0.juqh67l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')  # Adjust the connection string
db = client['test']  # Replace with your database name

# Ensure the unique index exists on (name, site, date)
db.events.create_index(
    [
        ('name', 1),
        ('site', 1),
        ('date', 1)
    ],
    unique=True
)

# Get current UTC time
now = datetime.utcnow().replace(tzinfo=pytz.UTC)

# Fetch events that are not completed
events_to_process = db.events.find({
    'status': {'$ne': 'completed'}
})

for event in events_to_process:
    original_status = event['status']

    try:
        # Ensure the event date is timezone-aware
        if event['date'].tzinfo is None:
            event['date'] = event['date'].replace(tzinfo=pytz.UTC)

        # Fetch tickets associated with the event
        tickets = list(db.eventtickets.find({'event': event['_id']}))

        if tickets:
            # Ensure ticket times are timezone-aware
            for ticket in tickets:
                if 'saleEndTime' in ticket and ticket['saleEndTime'].tzinfo is None:
                    ticket['saleEndTime'] = ticket['saleEndTime'].replace(tzinfo=pytz.UTC)

                if 'saleStartTime' in ticket and ticket['saleStartTime'].tzinfo is None:
                    ticket['saleStartTime'] = ticket['saleStartTime'].replace(tzinfo=pytz.UTC)

            # Find the maximum saleEndTime among the tickets
            max_sale_end_time = max(
                (ticket['saleEndTime'] for ticket in tickets if 'saleEndTime' in ticket),
                default=datetime.min.replace(tzinfo=pytz.UTC)
            )

            if max_sale_end_time < now:
                # Event has passed
                # Update the event status to 'completed'
                db.events.update_one(
                    {'_id': event['_id']},
                    {'$set': {'status': 'completed'}}
                )

                if original_status == 'upcoming':
                    # Calculate the date for the new event (next week)
                    new_event_date = event['date'] + timedelta(weeks=1)
                    if new_event_date.tzinfo is None:
                        new_event_date = new_event_date.replace(tzinfo=pytz.UTC)

                    # Clone and create the new event
                    new_event_data = event.copy()
                    new_event_data['date'] = new_event_date
                    new_event_data['status'] = 'upcoming'
                    new_event_data.pop('_id', None)
                    new_event_data.pop('createdAt', None)
                    new_event_data.pop('updatedAt', None)
                    new_event_data['tickets'] = []

                    try:
                        # Insert the new event
                        new_event_id = db.events.insert_one(new_event_data).inserted_id

                        # Clone tickets and associate them with the new event
                        for ticket in tickets:
                            new_ticket_data = ticket.copy()
                            date_difference = new_event_date - event['date']

                            new_ticket_data['saleStartTime'] = ticket['saleStartTime'] + date_difference
                            new_ticket_data['saleEndTime'] = ticket['saleEndTime'] + date_difference
                            new_ticket_data['event'] = new_event_id

                            new_ticket_data['availableQuantity'] = new_ticket_data['totalQuantity']
                            new_ticket_data.pop('_id', None)
                            new_ticket_data.pop('createdAt', None)
                            new_ticket_data.pop('updatedAt', None)

                            # Insert the new ticket
                            new_ticket_id = db.eventtickets.insert_one(new_ticket_data).inserted_id

                            # Update the new event's tickets array
                            db.events.update_one(
                                {'_id': new_event_id},
                                {'$push': {'tickets': new_ticket_id}}
                            )

                        print(f'Created new event "{new_event_data["name"]}" for date {new_event_date.isoformat()}.')
                    except DuplicateKeyError:
                        print(f'Event "{new_event_data["name"]}" already exists for date {new_event_date.isoformat()}. Skipping creation.')

            else:
                # Event has not passed, no action needed
                pass
        else:
            # No tickets associated, no action needed
            pass
    except Exception as e:
        # Handle errors and log them
        print(f'Error processing event {event["_id"]}: {e}')
