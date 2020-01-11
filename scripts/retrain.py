import os
import sys
from os import listdir
import Classifier

serverDataPathBase = os.path.dirname(os.path.realpath(__file__)) + "/../data/"
serverDataRecordsPath = serverDataPathBase + "records"

users = [f for f in listdir(serverDataRecordsPath)]
skip_users = []

stats = ""
#### STEP 2: CREATE MODELS
for user in users:
    if user in skip_users:
        print("!!! SKIPPED MODEL FOR: " + user)
        continue

    print("CREATING MODEL FOR: " + user)
    score = Classifier.main(serverDataPathBase  + "features/", serverDataPathBase  + "models/", user)

    stats += user + ": " + str(score) + "\n"

###################################################################
# Last print should be in JSON format
print ('{"stats": "'+stats+'"}')
sys.stdout.flush()
