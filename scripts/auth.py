import os
import sys
import CreateFeatureFile
import Classifier

print(os.path.dirname(os.path.realpath(__file__)))

userName = sys.argv[1]
recordKey = sys.argv[2]
forceModelUsername = sys.argv[3]
windowSize = int(sys.argv[4] or "4")
recordPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/detect/" + userName + "-" + recordKey + ".raw.csv"
featuresOutPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/detect/" + userName + "-" + recordKey + ".features.csv"
print ("Detection Record of raw CSV is located at " + recordPath)
print ("Detection Output CSV with features will be " + featuresOutPath)
###################################################################

CreateFeatureFile.main(recordPath, featuresOutPath,  windowSize)

model_path = os.path.dirname(os.path.realpath(__file__)) + "/../data/models/"+forceModelUsername+".model"
authTrustScore = Classifier.predict(model_path, featuresOutPath)

###################################################################
# Last print should be in JSON format
print ("{\"authTrust\": " + str(authTrustScore) + "}")
sys.stdout.flush()
