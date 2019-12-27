import sys
import CreateFeatureFile

userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = "../data/" + userName + "/" + recordKey + ".raw.csv"
print ("Record of raw CSV is located at " + recordPath)
###################################################################

CreateFeatureFile.main(recordPath, userName, 60)

###################################################################
# Last print should be in JSON format
print ('{}')
sys.stdout.flush()
