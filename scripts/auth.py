import sys
import os
import math
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from scipy import signal
from fastdtw import fastdtw

userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = "../data/" + userName + "/detect/" + recordKey + ".raw.csv"
print (
            "Unknown raw CSV record is located at " + recordPath + ", return authentication trust score that it really belongs to " + userName)
###################################################################

# code here

###################################################################
# Lat print should be in JSON format
print ("{\"authTrust\": 78.8}")
sys.stdout.flush()
