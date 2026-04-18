import os
import datetime
from googleapiclient.discovery import build
from google.oauth2 import service_account

class GSCConnector:
    def __init__(self, property_url):
        self.property_url = property_url
        self.credentials = self._load_credentials()
        self.service = build('searchconsole', 'v1', credentials=self.credentials)

    def _load_credentials(self):
        # Load from environment variable for GitHub Actions safety
        creds_json = os.getenv('GSC_CREDENTIALS_JSON')
        if not creds_json:
            raise ValueError("GSC_CREDENTIALS_JSON not found in environment")
        
        with open('gsc_creds.json', 'w') as f:
            f.write(creds_json)
        
        return service_account.Credentials.from_service_account_file(
            'gsc_creds.json',
            scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )

    def get_performance_data(self, days=30):
        end_date = datetime.date.today() - datetime.timedelta(days=3) # GSC has ~3 day lag
        start_date = end_date - datetime.timedelta(days=days)
        
        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['page'],
            'rowLimit': 1000
        }
        
        return self.service.searchanalytics().query(
            siteUrl=self.property_url, body=request).execute()

if __name__ == "__main__":
    connector = GSCConnector("https://ewastekochi.com/")
    data = connector.get_performance_data()
    print(data)
