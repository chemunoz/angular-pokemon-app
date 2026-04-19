module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      pokeApiId: { type: Number, unique: true, sparse: true },
      name: { type: String, required: true },
      imageUrl: { type: String },
      types: [{ type: String }],
      stats: {
        hp: { type: Number, default: 50 },
        attack: { type: Number, default: 50 },
        defense: { type: Number, default: 50 },
        speed: { type: Number, default: 50 }
      },
      height: { type: Number, default: 10 },
      weight: { type: Number, default: 50 },
      isCustom: { type: Boolean, default: false },
      fromApi: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Pokemon = mongoose.model("pokemon", schema);
  return Pokemon;
};