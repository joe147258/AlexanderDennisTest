CREATE TABLE EngineerTable (id int NOT NULL IDENTITY(1,1) PRIMARY KEY, AddressLineOne varchar(255), AddressLineTwo varchar(255), City varchar(255), County varchar(255),
PostCode varchar(255), FirstName varchar(255), LastName varchar(255), Email varchar(255), ContactNumber varchar(255), JobCategory varchar(255), 
BookingDate DATE, TimeSlot varchar(255), Comment varchar(255), Registration varchar(255));
CREATE TABLE FullyBookedTimesTable (BookingDate DATE, TimeSlot varchar(255));
INSERT INTO FullyBookedTimesTable (BookingDate, TimeSlot) VALUES ('2022-10-17', '11:00 - 13:00');
INSERT INTO FullyBookedTimesTable (BookingDate, TimeSlot) VALUES ('2022-10-18', '9:00 - 11:00');
INSERT INTO FullyBookedTimesTable (BookingDate, TimeSlot) VALUES ('2022-10-20', '9:00 - 11:00');