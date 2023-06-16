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
    name: "Zofar",
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
    name: "Al-Dhahirah",
    states: [{ name: "Ibri" }, { name: "Yanqul" }, { name: "Dhank" }],
  },
  {
    name: "Al Batinah North",
    states: [
      { name: "Sohar" },
      { name: "Shinas" },
      { name: "Liwa" },
      { name: "Saham" },
      { name: "Al Khaboura" },
      { name: "Suwayq" },
    ],
  },
  {
    name: "Albatinah South",
    states: [
      { name: "Rustaq" },
      { name: "Al Awabi" },
      { name: "Nakhal" },
      { name: "Wadi Al Maawil" },
      { name: "Barka" },
      { name: "Al-Musannah" },
    ],
  },
  {
    name: "Al Buraimi",
    states: [
      { name: "Al Buraimi State" },
      { name: "Mahdah" },
      { name: "As-Sunaynah" },
    ],
  },
  {
    name: "Al Wusta",
    states: [
      { name: "Haima" },
      { name: "Duqm" },
      { name: "Mahout" },
      { name: "Al Jazer" },
      { name: "Ibra" },
      { name: "Wadi Bani Khalid" },
    ],
  },
  {
    name: "Ash-Sharqiyah North",
    states: [
      { name: "Al-Qabi" },
      { name: "Al-Mudhaibi" },
      { name: "Bidiya" },
      { name: "Dema Wa Thaieen" },
      { name: "Ibra" },
      { name: "Wadi Bani Khalid" },
    ],
  },
  {
    name: "Ash-Sharqiyah South",
    states: [
      { name: "Sur" },
      { name: "Al-Kamil and Al-Wafi" },
      { name: "Jalan Bani Bu Hassan" },
      { name: "Jalan Bani Bu Ali" },
      { name: "Masirah" },
    ],
  },
  {
    name: "Musandam",
    states: [
      { name: "Khasab" },
      { name: "Bukha" },
      { name: "Dibba Al-Bay'ah" },
      { name: "Madha" },
    ],
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
