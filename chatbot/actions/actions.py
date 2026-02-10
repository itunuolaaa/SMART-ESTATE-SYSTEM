from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

BASE_URL = "http://localhost:5000/api"

class ActionCheckDues(Action):

    def name(self) -> Text:
        return "action_check_dues"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        # Hardcoded user ID for demo (in production, use sender_id or authentication)
        user_id = 1 
        
        try:
            response = requests.get(f"{BASE_URL}/payments/dues/{user_id}")
            if response.status_code == 200:
                data = response.json()
                amount = data.get('amount', 0)
                dispatcher.utter_message(
                    text=f"Your outstanding estate due is ₦{amount}."
                )
            else:
                dispatcher.utter_message(text="Could not retrieve dues at the moment.")
        except Exception as e:
            dispatcher.utter_message(text=f"Error connecting to server: {str(e)}")

        return []

class ActionCheckPaymentStatus(Action):

    def name(self) -> Text:
        return "action_check_payment_status"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        user_id = 1 # Demo user

        try:
            response = requests.get(f"{BASE_URL}/payments/history/{user_id}")
            if response.status_code == 200:
                history = response.json()
                if history:
                    last_payment = history[-1] # Get most recent
                    dispatcher.utter_message(
                        text=f"Your last payment of ₦{last_payment['amount']} was {last_payment['status']}."
                    )
                else:
                    dispatcher.utter_message(text="No payment history found.")
            else:
                dispatcher.utter_message(text="Could not retrieve payment status.")
        except Exception as e:
            dispatcher.utter_message(text="System error checking payments.")

        return []

class ActionLodgeComplaint(Action):

    def name(self) -> Text:
        return "action_lodge_complaint"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        user_id = 1 # Demo user
        
        # In a real scenario, we would extracting entities or slots.
        # Here we just take the last user message as the complaint description.
        last_message = tracker.latest_message.get('text')

        payload = {
            "userId": user_id,
            "title": "Complaint via Chatbot",
            "description": last_message
        }

        try:
            response = requests.post(f"{BASE_URL}/options/complaints/lodge", json=payload)
            if response.status_code == 200:
                dispatcher.utter_message(text="Your complaint has been lodged successfully.")
            else:
                dispatcher.utter_message(text="Failed to lodge complaint.")
        except Exception as e:
            dispatcher.utter_message(text="System error lodging complaint.")

        return []