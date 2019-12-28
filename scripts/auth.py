import os
import sys
import CreateFeatureFile

print(os.path.dirname(os.path.realpath(__file__)))


userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/detect/" + userName + "-" + recordKey + ".raw.csv"
featuresOutPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/detect/" + userName + "-" + recordKey + ".features.csv"
print ("Detection Record of raw CSV is located at " + recordPath)
print ("Detection Output CSV with features will be " + featuresOutPath)
###################################################################

CreateFeatureFile.main(recordPath, featuresOutPath, 4)

###################################################################
# Last print should be in JSON format
print ("{\"authTrust\": 78.8}")
sys.stdout.flush()
