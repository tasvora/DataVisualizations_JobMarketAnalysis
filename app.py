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
indeed_jobs_byregion = Base.classes.indeed_jobs_byregion


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/states")
def states():
    """Return a list of states."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(indeed_jobs).statement
    indeed_df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    states = indeed_df["state"].dropna().unique()
    states = list(states)
    #states.remove(null)

    return jsonify(states)

@app.route("/states/<state>")
def get_state(state):
    """Return the MetaData for a given sample."""
    stmt = db.session.query(indeed_jobs).statement
    indeed_df = pd.read_sql_query(stmt, db.session.bind)

    indeed_df['state']=indeed_df['state'].str.strip()
    indeed_df = indeed_df[indeed_df["state"] == state]

    return indeed_df.to_json(orient = 'records')

@app.route("/regions")
def regions():
    """Return a list of regions."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(indeed_jobs_byregion).statement
    indeed_byregion_df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    regions = indeed_byregion_df["region"].dropna().unique()
    regions = list(regions)

    return jsonify(regions)

@app.route("/regions/<region>")
def get_region(region):
    """Return the MetaData for a given sample."""
    stmt = db.session.query(indeed_jobs_byregion).statement
    indeed_byregion_df = pd.read_sql_query(stmt, db.session.bind)

    indeed_byregion_df['region']=indeed_byregion_df['region'].str.strip()
    indeed_byregion_df = indeed_byregion_df[indeed_byregion_df["region"] == region]
    
    return indeed_byregion_df.to_json(orient='records')
    #return jsonify(indeed_byregion_df.to_list())

if __name__ == "__main__":
    app.run(debug=True)



