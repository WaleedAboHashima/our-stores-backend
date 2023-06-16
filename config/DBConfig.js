const mongoose = require("mongoose");
mongoose.set({ strictPopulate: false });
const data = require("../models/Governments");
const governments = [
  {
    name: "Maskat",
    states: [
      { name: "Mutrah" },
      { name: "Bausher" },
      { name: "Seeb" },
      { name: "Al Amerat" },
      { name: "Quriyat" },
    ],
  },
  {
    name: "Dhofar",
    states: [
      { name: "Salalah" },
      { name: "Thumrait" },
      { name: "Taqa" },
      { name: "Mirbat" },
      { name: "Rakhiot" },
      { name: "Dhalkut" },
      { name: "Sadh" },
      { name: "Shalim and the Hallaniyat Islands" },
      { name: "Mqshin" },
      { name: "Almazyona" },
    ],
  },
  {
    name: "Aldakhiliyah",
    states: [
      { name: "Nuzwa" },
      { name: "Bahla" },
      { name: "Manh" },
      { name: "Al Hamraa" },
      { name: "Adam" },
      { name: "Ezky" },
      { name: "Samael" },
      { name: "Baddbd" },
      { name: "Al Gabal Al Akhdar" },
    ],
  },
  {
    name: "Albatinah",
    states: [],
  },
  {
    name: "Albatinah North",
    states: [],
  },
  {
    name: "Albatinah South",
    states: [],
  },
  {
    name: "Buraimi",
    states: [],
  },
  {
    name: "Alwastai",
    states: [],
  },
  {
    name: "North Sharqiyah",
    states: [],
  },
  {
    name: "South Sharqiyah",
    states: [],
  },
  {
    name: "Musandam",
    states: [],
  },
];

module.exports = () =>
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

data
  .countDocuments()
  .then((count) => {
    if (count === 0) {
      return data.insertMany(governments).then(async () => {
        await data.create(governments);
        console.log("Data inserted successfully");
      });
    }
  })
  .catch((error) => {
    console.error(`Error: ${error}`);
  });
