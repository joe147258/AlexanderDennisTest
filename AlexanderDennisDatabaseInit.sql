USE master;  
GO  
CREATE DATABASE AlexanderDennisTest;
CREATE TABLE EngineerTable (id int NOT NULL IDENTITY(1,1) PRIMARY KEY, AddressLineOne varchar(255), AddressLineTwo varchar(255), City varchar(255), County varchar(255),
PostCode varchar(255), FirstName varchar(255), LastName varchar(255), Email varchar(255), ContactNumber varchar(255), JobCategory varchar(255), 
BookingDate DATE, TimeSlot varchar(255), Comment varchar(255), Registration varchar(255));