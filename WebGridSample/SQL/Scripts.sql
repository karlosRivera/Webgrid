CREATE PROCEDURE [dbo].USP_UpdateStudent
	@param1 int = 0,
	@param2 int
AS

Declare @Data xml  
  
set @Data=  
'<?xml version="1.0" encoding="utf-16"?>
<Students>  
	<Student>    
		<ID>2</ID>    
		<FirstName>Tridip</FirstName>    
		<LastName>Bhattacharjee</LastName>    
		<IsActive>true</IsActive>    
		<StateID>2</StateID>    
		<CityID>4</CityID>  
	</Student>
</Students>'  

	
	BEGIN TRY
		MERGE into Student as Trg  
		Using (select d.x.value('id[1]','varchar(MAX)') as ID,
		d.x.value('FirstName[1]','varchar(MAX)') as FirstName ,  
		d.x.value('LastName[1]','varchar(MAX)') as LastName,
		d.x.value('StateID[1]','int') as StateID,
		d.x.value('CityID[1]','int') as CityID,
		d.x.value('IsActive[1]','bit') as IsActive
		from @data.nodes('/Students/Student') as  d(x)) as Src  
		on Trg.ID=Src.ID  
		When Matched Then 
			UPDATE set   
			Trg.FirstName=Src.FirstName,  
			Trg.LastName=Src.LastName,
			Trg.StateID=Src.StateID,
			Trg.CityID=Src.CityID,
			Trg.IsActive=Src.IsActive
		when not matched by target then   
			insert (FirstName,LastName,StateID,CityID,IsActive) 
			values(Src.FirstName,Src.LastName,Src.StateID,Src.CityID,Src.IsActive);   
	END TRY
	BEGIN CATCH
	  -- Insert Error into table
	  --INSERT INTO #error_log(message)
	  --VALUES (ERROR_MESSAGE());
	END CATCH


