module.exports = {
    Query: {
        pets: (_, { input }, { models }) => models.Pet.find(input),
        pet: (_, { _id }, { models }) => models.Pet.findOne({ _id })
    },

    Mutation: {
        addPet: (_, { input }, { models }) => {
            const pet = new models.Pet({ ...input })
            pet.save()
            return pet
        }
    },

    Pet: {
        owner: (pet, _, { models }) => models.User.findOne({ _id: pet.owner })
    }
}