import os

import pandas as pd
import numpy as np
import psycopg2

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

user = 'postgres'
pw = 'postgres'
database = 'Jobs'
url = 'localhost:5432'

DB_URL = f'postgresql+psycopg2://{user}:{pw}@{url}/{database}'
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
db = SQLAlchemy(app)
Base = automap_base()
# reflect the tables

Base.prepare(db.engine, reflect=True)

indeed_jobs = Base.classes.indeed_jobs
glassdoor_jobs =Base.classes.glassdoor_jobs


def getGlassdoorData():
    results = db.session.query(glassdoor_jobs).all()

    jobs = []
    bins =[]
    for result in results:
        # count by company name


        data.append({
            "bins": bins,
            "jobs": jobs
        })
    return jsonify(data)


def getIndeedData():
    results = db.session.query(indeed_jobs).all()

    jobs = []
    bins =[]
    for result in results:
        # todo count by company name


        data.append({
            "bins": bins,
            "jobs": jobs
        })
    return jsonify(data)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/histogram/glassdoor")
def glassdoorData():
    return getGlassdoorData()

@app.route("/api/histogram/indeed")
def indeedData():
    return getIndeedData()


if __name__ == "__main__":
    app.run(debug=True)



