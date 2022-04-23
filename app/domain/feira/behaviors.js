const { Stand } = require('./feira'); 

const updateScheduleHour = ({ Stand, scheduleHour }) => {
  if (typeof scheduleHour !== typeof '') {
    throw new Error('Agendamento não pode ser vazio'); 
  }
  return Stand({
    ...Stand,
    scheduleHour,
  });
}

module.exports = {
  updateScheduleHour, 
} 