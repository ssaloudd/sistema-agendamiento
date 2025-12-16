const citasDB = [];

const CitaRepository = {
    findAll: () => citasDB,
    
    findById: (id) => citasDB.find(c => c.id === id),
    
    create: (cita) => {
        citasDB.push(cita);
        return cita;
    },
    
    update: (id, datosActualizados) => {
        const index = citasDB.findIndex(c => c.id === id);
        if (index !== -1) {
            citasDB[index] = { ...citasDB[index], ...datosActualizados };
            return citasDB[index];
        }
        return null;
    }
};

module.exports = CitaRepository;