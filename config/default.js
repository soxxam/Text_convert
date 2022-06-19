module.exports={
    app:{
        port:3000,
        views_floder: __dirname+'/../src/apps/views',
        views_engine: 'ejs',
        static_folder: __dirname+'/../src/public',
        session_key: "kendz",
        session_secure: false,
        temp : __dirname + "/../temp",
    },
    mail: {
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: "kienteo1012@gmail.com",
            pass: "feukpqumpzthjsee",
        }
    },
}