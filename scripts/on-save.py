import os
import sys
import CreateFeatureFile

print(os.path.dirname(os.path.realpath(__file__)))


userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/records/" + userName + "/" + recordKey + ".raw.csv"
featuresOutPath = os.path.dirname(os.path.realpath(__file__)) + "/../data/records/" + userName + "/" + recordKey + ".features.csv"
print ("Record of raw CSV is located at " + recordPath)
print ("Output CSV with features will be " + featuresOutPath)
###################################################################

CreateFeatureFile.main(recordPath, featuresOutPath, 4)

###################################################################
# Last print should be in JSON format
print ('{"featuresOutPath":"'+featuresOutPath+'"}')
sys.stdout.flush()
