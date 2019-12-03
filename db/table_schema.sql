
CREATE TABLE indeed_jobs(
	company_name VARCHAR,
	title VARCHAR,
	job_title VARCHAR,
	job_summary VARCHAR,
	city VARCHAR,
	state VARCHAR,
	id not null as PRIMARY KEY,
);

--ALTER TABLE indeed_jobs
--	add column ID
	--serial Primary Key;
select * from indeed_jobs;

	
CREATE TABLE indeed_jobs_byregion(
	company VARCHAR,
	title VARCHAR,
	job_title VARCHAR,
	job_summary VARCHAR,
	city VARCHAR,
	state VARCHAR,
	state1 VARCHAR,
	region VARCHAR,
	id not null as primary key
);

select * from indeed_jobs_byregion;
select count (*) from indeed_jobs_byregion;	
ALTER TABLE indeed_jobs_byregion
	add column ID
	serial Primary Key;	
	

DROP TABLE IF EXISTS glassdoor_jobs;
CREATE TABLE glassdoor_jobs(
 	Id SERIAL Primary Key,
 	company VARCHAR,
 	position VARCHAR,
  	reviews VARCHAR,
  	region VARCHAR,
  	city VARCHAR,
  	state VARCHAR
 );

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	








)





