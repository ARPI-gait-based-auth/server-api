import os
import sys
from os import listdir
from os.path import isfile, join
import CreateFeatureFile
import Classifier

print(os.path.dirname(os.path.realpath(__file__)))

serverDataRecordsPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/records"


users = [f for f in listdir(serverDataRecordsPath)]

skip_users = []
serverDataPathBase = os.path.dirname(os.path.realpath(__file__)) + "/../data/"
serverDataRecordsPath = serverDataPathBase + "records"
###################################################################


def fix_feature(c, s):
    chunks = s.split(",")
    chunks[0] = str(c)
    return ",".join(chunks)

#### STEP 1: extract
for user in users:
    userBasePath = join(serverDataRecordsPath, user)
    allRecords = listdir(userBasePath)
    records = filter(lambda x: x.endswith('.raw.csv'), allRecords)
    featuresHead = ""
    allFeatures = []
    for record in records:
        recordName = record[:-8]
        recordBasePath = join(userBasePath, recordName)
        recordPath = join(userBasePath, recordName + ".raw.csv")
        featuresPath = join(userBasePath, recordName + ".features.csv")
        CreateFeatureFile.main(recordPath, featuresPath, 4)
        # # Old way
        # copyfile(featuresPath, serverDataPathBase + "features/" + user + ".csv")
        with open(featuresPath) as f:
            lines = f.readlines()
            if len(allFeatures) == 0:
                featuresHead = lines[0].replace('\n', '')
                allFeatures = lines[1:]
            else:
                allFeatures = allFeatures + lines[1:]

    if len(allFeatures) <= 1:
        print("WARNING no features for " + user)
        skip_users.append(user)
    f = open(serverDataPathBase + "features/" + user + ".csv", "w")

    allFeatures = map(lambda x: fix_feature(x[0], x[1]), enumerate(allFeatures))

    f.write(featuresHead + "\n" + "\n".join(map(lambda x: x.replace('\n', ''), allFeatures)))
    f.close()


###################################################################
# Last print should be in JSON format
print ('{}')
sys.stdout.flush()
