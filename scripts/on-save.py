import sys

userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = "../data/" + userName + "/" + recordKey + ".csv"

print "New csv was stored under " + recordPath

sys.stdout.flush()
