# AzAzureActiveDirectory
Azure Active Directory with API management


### Create a tenant
overcome error
az login
az account list
az account set -s "<INSERT YOUR SUBSCRIPTION NAME>"
az provider register --namespace Microsoft.AzureActiveDirectory

### Register Google as an identity provider
go to console.cloud.google.com

go to api&services --> OAuth consent screen --> external
fill in appname 
user support email
Add an authorized domain and insert Azure's b2c domain: "b2clogin.com"
finally, add a developer email account (this can be the same as the user support email)

click save and continue 2 times and then back to dashboard. Finally click the publish app button

click on credentials in the side bar and click create credentials and choose the create OAuth client ID.

for application type: Web application
name: your app name
for authorized javascript origins add uri: 
https://<INSERT_YOUR_TENANT_NAME>.b2clogin.com

for Authorized redirect URIs add uri:
https://<INSERT_YOUR_TENANT_NAME>.b2clogin.com/<INSERT_YOUR_TENANT_NAME>.onmicrosoft.com/oauth2/authresp

click create and copy the client ID and client secret. Go back to the azure portal, azure ad b2c, identity providers and click google.
for name insert: Google
for Client ID: insert copied client ID from the google console.
for Client Secret: insert copied client secret from the google console.

### Create User flow
click on User flows on the side panel and click + New user flow. Click signup and signin and hit create.

enter your project name for name.
Select email signup and Check Google as social identity providers

Finally, click create.

