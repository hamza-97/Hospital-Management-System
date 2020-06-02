
if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true'}
  // module.exports = {mongoURI: 'mongodb://localhost:27017/hms'}
} else {
	  module.exports = {mongoURI: 'mongodb+srv://scriptomania:group23@script-6wmwk.mongodb.net/test?retryWrites=true'}
// module.exports = {mongoURI: 'mongodb://localhost:27017/hms'}
}
