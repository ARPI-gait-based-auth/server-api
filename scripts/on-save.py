import sys
import os
import math
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
from scipy import signal
from fastdtw  import fastdtw

userName = sys.argv[1]
recordKey = sys.argv[2]
recordPath = "../data/" + userName + "/" + recordKey + ".raw.csv"
print ("Record of raw CSV is located at " + recordPath)
###################################################################

# code here

###################################################################
# Lat print should be in JSON format
print ('{}')
sys.stdout.flush()
