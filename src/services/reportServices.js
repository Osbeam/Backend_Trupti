const CallingSchema = require('../model/adminSchema');

async function getCallingReport(id, callstatus, leadcallstatus, date) {
    try {
        
        const providedDate = date ? new Date(date) : new Date();
        
        const startOfDay = new Date(providedDate);
        startOfDay.setHours(0, 0, 0, 0);
    
        const endOfDay = new Date(providedDate);
        endOfDay.setHours(23, 59, 59, 999);
    
        const query = {
            AssignedTo: id,
            ...(callstatus && { CallStatus: callstatus }),
            ...(leadcallstatus && { LeadCallStatus: leadcallstatus }),
            CallStatusUpdatedAt: { $gte: startOfDay, $lt: endOfDay }

        }
        const data = await CallingSchema.find(query).select('Name MobileNo1 MobileNo2 IsLead IsCalled LeadCallStatus CallStatus CallStatusUpdatedAt');
        const count = await CallingSchema.countDocuments(query);

        return{
            data,
            count
        }

    } catch (error) {
    throw new Error("Error retrieving calling report" + error.message);
    }
}

module.exports ={getCallingReport}