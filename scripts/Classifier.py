# imports
import os
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC


class Classifiers:
    def __init__(self, features_path):
        self.data_path = features_path
        self.other_data = None
        self.your_data = None
        self.x_train = []
        self.x_test = []
        self.y_test = []
        self.y_train = []
        self.models = {}

        # setup the models to be used
        self.setup_models()

    def setup_models(self):
        self.models['LR'] = LogisticRegression(solver='liblinear', multi_class='ovr')
        self.models['LDA'] = LinearDiscriminantAnalysis()
        self.models['KNN'] = KNeighborsClassifier()
        self.models['CART'] = DecisionTreeClassifier(max_depth=7)
        self.models['NB'] = GaussianNB()
        self.models['SVM'] = SVC(gamma='auto')

    def scan_folder_for_other_data(self, username):
        feature_data = []
        # iterate over all the files in directory 'features'
        for file_name in os.listdir(self.data_path):
            if file_name.endswith(".csv") and not file_name.startswith(username):
                feature_data.append(pd.read_csv(self.data_path + file_name, sep=",", header=0))
        self.other_data = pd.concat(feature_data).dropna().reset_index()
        self.other_data["isItYou"] = 0

    def scan_folder_for_your_data(self, username):
        for file_name in os.listdir(self.data_path):
            if file_name.startswith(username):
                self.your_data = pd.read_csv(self.data_path + file_name, sep=",", header=0)
                self.your_data = self.your_data.reset_index()
                self.your_data["isItYou"] = 1

    def split_the_data(self):
        # split the data from other feature files
        X = self.other_data[
            self.other_data.loc[:, self.other_data.columns != 'isItYou'].columns]
        y = self.other_data['isItYou']
        ox_train, ox_test, oy_train, oy_test = train_test_split(X, y, test_size=.2, random_state=1)

        # split your data from the feature file
        self.your_data.index = self.your_data.index + len(self.other_data.values)
        X = self.your_data[self.your_data.loc[:, self.your_data.columns != 'isItYou'].columns]
        y = self.your_data["isItYou"]
        yx_train, yx_test, yy_train, yy_test = train_test_split(X, y, test_size=.2, random_state=1)

        self.x_train = pd.concat([ox_train, yx_train], sort=False)
        self.x_test = pd.concat([ox_test, yx_test], sort=False)
        self.y_train = pd.concat([oy_train, yy_train], sort=False)
        self.y_test = pd.concat([oy_test, yy_test], sort=False)


    def run_classifier(self, name):
        model = self.models[name]
        kfold = StratifiedKFold(n_splits=10)
        cv_results = cross_val_score(model, self.x_train, self.y_train, cv=kfold, scoring='accuracy')
        print('%s: %f (%f)' % (name, cv_results.mean(), cv_results.std()))

        model.fit(self.x_train, self.y_train)
        predictions = model.predict(self.x_test)

        # Evaluate predictions
        score = accuracy_score(self.y_test, predictions)
        print(score)
        print()
        print(confusion_matrix(self.y_test, predictions))
        print()
        print(classification_report(self.y_test, predictions))
        print("_________________________________________________")

        return (model, score)

def predict(model_path, auth_features_path):
    model = pickle.load(open(model_path, 'rb'))
    auth_data = pd.read_csv(auth_features_path, sep=",", header=0)
    auth_data = auth_data.reset_index()
    score = model.predict(auth_data)
    return sum(score) / float(len(score))

def getScoreForAll(features_path, username):
    classifier = Classifiers(features_path)
    classifier.scan_folder_for_other_data(username)
    classifier.scan_folder_for_your_data(username)
    classifier.split_the_data()

    best_model = (0, None, None)
    for x in ["LR", "LDA", "KNN", "CART", "NB", "SVM"]:
        y = classifier.run_classifier(x)
        model = y[0]
        score = y[1]
        if best_model[0] <= score:
            best_model = (score, x, model)

    return best_model

def main(features_path, models_path, username):
    classifier = Classifiers(features_path)
    classifier.scan_folder_for_other_data(username)
    classifier.scan_folder_for_your_data(username)
    classifier.split_the_data()

    # model =  classifier.run_classifier("LR")
    # model =  classifier.run_classifier("LDA")
    # model =  classifier.run_classifier("KNN")
    # model =  classifier.run_classifier("CART")
    model =  classifier.run_classifier("NB")
    # model = classifier.run_classifier("SVM")

    pickle.dump(model[0], open(models_path + username + ".model", 'wb'))
    return model[1]


if __name__ == "__main__":
    main(os.getcwd() + "/features/", "ziga_fix_")
