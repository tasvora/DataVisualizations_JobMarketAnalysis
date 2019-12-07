import os

import pandas as pd
import numpy as np
import psycopg2

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func,desc

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# user = 'postgres'
# pw = 'postgres'
# database = 'ETL_JobSite'
# url = 'localhost:5432'

user = 'postgres'
pw = 'Ivpadmin00#'
database = 'ETLProject'
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

##########################################################
## @Author : Maria Wisco
## Methods to obtain the State and Count by Title
## from indeed.com website 
## and routes to build Pie Chart in JS
##########################################################

@app.route("/states/indeedstates")
def indeedstates():
    """Return a list of states."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(indeed_jobs_byregion).statement
    indeed_df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    states = indeed_df["state"].dropna().unique()
    states = list(states)
    #states.remove(null)

    return jsonify(states)


@app.route("/states/glassdoorstates")
def glassdoorstates():
    """Return a list of states."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(glassdoor_jobs).statement
    glassdoor_df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    states = glassdoor_df["state"].dropna().unique()
    states = list(states)
    #states.remove(null)

    return jsonify(states)    

@app.route("/states/indeedstates/<state>/count")
def get_Indeedcount(state):
    """Return the number of openings in a state."""
    stmt = db.session.query(indeed_jobs_byregion).statement
    updated_df = pd.read_sql_query(stmt, db.session.bind)

    updated_df['state']=updated_df['state'].str.strip()
    updated_df = updated_df[updated_df['state'] == state]
    updated_df = updated_df[['state','region', 'title','company']]
    updated_df = updated_df.groupby(['state','title','region']).count()
    updated_df=updated_df.sort_values('state', ascending=False)
    updated_df= updated_df.reset_index()
    
    return updated_df.to_json(orient='records')


@app.route("/states/glassdoorstates/<state>/count")
def get_Glassdoorcount(state):
    """Return the number of openings in a state."""
    stmt = db.session.query(glassdoor_jobs).statement
    updated_df = pd.read_sql_query(stmt, db.session.bind)

    updated_df['state']=updated_df['state'].str.strip()
    #updated_df = updated_df[updated_df['state'] == state]
    updated_df = updated_df[['state','region', 'position', 'company']]
    updated_df = updated_df.groupby(['state','position', 'region']).count()
    updated_df=updated_df.sort_values('state', ascending=False)
    updated_df= updated_df.reset_index()
    
    return updated_df.to_json(orient='records')    

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
    indeed_df = pd.read_sql_query(stmt, db.session.bind)

    indeed_df['region']=indeed_df['region'].str.strip()
    indeed_df = indeed_df[indeed_df["region"] == region]
    updated_df = indeed_df[['region', 'title','company']]
    updated_df = updated_df.groupby(['region','title']).count()
    updated_df= updated_df.sort_values('region', ascending=False)
    updated_df= updated_df.reset_index()

    return updated_df.to_json(orient='records')

## route for bubble chart    
@app.route("/allregions")
def get_region2():
    """Return the MetaData for a given sample."""
    stmt = db.session.query(indeed_jobs_byregion).statement
    updated_df = pd.read_sql_query(stmt, db.session.bind)

    region = updated_df["state"].unique()
    region2 = updated_df["company"].unique()

    new_df = []
    for state in region:
    
        new_df.append({
             "state":state,
            "count_state_opening": len(updated_df[updated_df['state'] == state ])
        })

    for company in region2:
        new_df.append({
            "company": company,
            "count_company_opening": len(updated_df[updated_df['company'] == company])
        })
    
    new_df = pd.DataFrame(new_df)

    return new_df.to_json(orient='records')

##########################################################
## @Author : Tasneem Talawalla
## Methods to obtain the count of jobs for each state
## from indeed.com website
##########################################################
@app.route("/indeed_jobs")
def jobmap1():
#    """Return a list of states."""
    # Use Pandas to perform the sql query
    stmt1 = db.session.query(indeed_jobs_byregion.state, func.count(indeed_jobs_byregion.state)).\
            group_by(indeed_jobs_byregion.state).statement
    indeed_state_df = pd.read_sql_query(stmt1, db.session.bind)

    indeed_state_df['state']=indeed_state_df['state'].str.strip()
    return indeed_state_df.to_json(orient = 'records')            

##########################################################
## @Author : Tasneem Talawalla
## Methods to obtain the count of jobs for each state
## from indeed.com website
##########################################################
@app.route("/glassdoor_jobs")
def jobmap2():
    #"""Return a list of states."""

    # Use Pandas to perform the sql query
    stmt2 = db.session.query(glassdoor_jobs.state, func.count(glassdoor_jobs.state)).\
        group_by(glassdoor_jobs.state).statement
    glassdoor_state_df = pd.read_sql_query(stmt2, db.session.bind)
    glassdoor_state_df

    glassdoor_state_df['state']=glassdoor_state_df['state'].str.strip()
    return glassdoor_state_df.to_json(orient = 'records') 

##########################################################
## @Author : Indira V. Poovambur
## Histogram Section
## from glassdoor and indeed.com
##########################################################
def getGlassdoorData():
    # results = db.session.query(glassdoor_jobs.company, func.count(glassdoor_jobs.id))\
    #     .group_by(glassdoor_jobs.company).order_by(desc(func.count(glassdoor_jobs.id))).limit(20)
    results = db.session.query(func.count(glassdoor_jobs.id))\
        .group_by(glassdoor_jobs.company).order_by(desc(func.count(glassdoor_jobs.id))).limit(20)

    df = pd.DataFrame(results, columns=['count'])
    # company_list= list(df['company'])
    count_list=list(df['count'])
    # masterList = {'company': company_list, 'count': count_list }
    return jsonify(count_list)

def getIndeedData():
    results = db.session.query(func.count(indeed_jobs_byregion.id))\
        .group_by(indeed_jobs_byregion.company).order_by(desc(func.count(indeed_jobs_byregion.id))).limit(20)
    df = pd.DataFrame(results, columns=['count'])
    # company_list= list(df['company'])
    count_list=list(df['count'])
    # masterList = {'company': company_list, 'count': count_list }
    return jsonify(count_list)

#### By state
def getGlassdoorDataByState():
    results = db.session.query(glassdoor_jobs.state).order_by(glassdoor_jobs.state)
    df = pd.DataFrame(results, columns=['state'])
    state_list= list(df['state'].str.strip())
    return jsonify(state_list)

def getIndeedDataByState():
    results = db.session.query(indeed_jobs_byregion.state).order_by(indeed_jobs_byregion.state)
    df = pd.DataFrame(results, columns=['state'])
    state_list= list(df['state'])
    return jsonify(state_list)

#### By region

def getGlassdoorDataByRegion():
    results = db.session.query(glassdoor_jobs.region)
    df = pd.DataFrame(results, columns=['region'])
    region_list= list(df['region'].str.strip())
    return jsonify(region_list)

def getIndeedDataByRegion():
    results = db.session.query(indeed_jobs_byregion.region)
    df = pd.DataFrame(results, columns=['region'])
    region_list= list(df['region'])
    return jsonify(region_list)

@app.route('/histograms')
def histograms():
    return render_template("histogram.html")

@app.route("/api/histogram/glassdoor")
def glassdoorData():
    return getGlassdoorData()

@app.route("/api/histogram/indeed")
def indeedData():
    return getIndeedData()

@app.route("/api/histogram/glassdoor/state")
def glassdoorDataState():
    return getGlassdoorDataByState()

@app.route("/api/histogram/indeed/state")
def indeedDataState():
    return getIndeedDataByState()

@app.route("/api/histogram/glassdoor/region")
def glassdoorDataRegion():
    return getGlassdoorDataByRegion()

@app.route("/api/histogram/indeed/region")
def indeedDataRegion():
    return getIndeedDataByRegion()

#### Taylor
@app.route("/taylor")
def taylor():
    return render_template("index_taylor.html")


if __name__ == "__main__":
    app.run(debug=True)



