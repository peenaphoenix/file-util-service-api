const pdfRoutes = require ('./pdf/routes');
const imageRoutes = require ('./image/routes');

const routes = [].concat (pdfRoutes).concat (imageRoutes);

module.exports = {
  routes: routes,
};
