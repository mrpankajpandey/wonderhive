const Listings = require("../model/listings.js");

module.exports.index = async (req, res) => {
  const allListings = await Listings.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "listing you're requested for does'nt exists...");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,filename);
  
  const newLitings = new Listings(req.body.listing);
  newLitings.owner = req.user._id;
  newLitings.image = { url, filename };
  await newLitings.save();
  req.flash("success", "new listings created");
  res.redirect("/listings");
  // res.send(url,filename)
};
module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listings.findById(id);
  //  let originalImgUrl =  listing.image.url;
  //  originalImgUrl=  originalImgUrl.replace("/upload","/upload/w_200,h_250")
  //  console.log(originalImgUrl);
   
   res.render("listings/edit.ejs", { listing});
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
 let listing =  await Listings.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { runValidators: true, new: true }
  );
  if(typeof req.file != "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
  req.flash("success", "listings edited successfully...");

  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListings = await Listings.findByIdAndDelete(id);
  req.flash("success", "listings deleted successfully...");

  res.redirect(`/listings`);
};
