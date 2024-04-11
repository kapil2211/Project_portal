const mongoose=require("mongoose");
const Project=require("./models/project");
main()
.then((res)=>{
    console.log("connection with database formed successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/project_portal');
};
const data = [
    {
      projectName: 'Murray-Raynor',
      postedBy: 'Lakin',
      requirements: 6578866254512128,
      duration: 5,
      job_location: 'remote',
      domain: 'ai'
    },
    {
      projectName: 'Willms',
      postedBy: 'Torphy',
      requirements: 4034521307545600,
      duration: 7,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'Kohler',
      postedBy: 'Kerluke',
      requirements: 775290116636672,
      duration: 3,
      job_location: 'on-site',
      domain: 'sdk'
    },
    {
      projectName: 'Cruickshank',
      postedBy: 'Sawayn',
      requirements: 3218591444893696,
      duration: 4,
      job_location: 'remote',
      domain: 'ai'
    },
    {
      projectName: 'King-Predovic',
      postedBy: 'Kub',
      requirements: 1931211226218496,
      duration: 9,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'Paucek',
      postedBy: 'Ondricka',
      requirements: 6364767113445376,
      duration: 2,
      job_location: 'remote',
      domain: 'sdk'
    },
    {
      projectName: 'Hagenes',
      postedBy: 'Mante',
      requirements: 3053107497926656,
      duration: 8,
      job_location: 'on-site',
      domain: 'ai'
    },
    {
      projectName: 'McCullough',
      postedBy: 'Jast-Deckow',
      requirements: 2619439180677120,
      duration: 6,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'Murray',
      postedBy: 'Wilkinson',
      requirements: 2488623372959744,
      duration: 1,
      job_location: 'remote',
      domain: 'sdk'
    },
    {
      projectName: 'Miller',
      postedBy: 'Weissnat',
      requirements: 80789274361856,
      duration: 5,
      job_location: 'on-site',
      domain: 'ai'
    },
    {
      projectName: 'Gleason',
      postedBy: 'Wiza',
      requirements: 2117912858984448,
      duration: 7,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'King',
      postedBy: 'McDermott',
      requirements: 3126947477454848,
      duration: 3,
      job_location: 'remote',
      domain: 'sdk'
    },
    {
      projectName: 'Lindgren',
      postedBy: 'Leannon',
      requirements: 5765141719154688,
      duration: 4,
      job_location: 'on-site',
      domain: 'ai'
    },
    {
      projectName: 'Cartwright',
      postedBy: 'Ernser',
      requirements: 8320496613457920,
      duration: 9,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'Hessel',
      postedBy: 'Mayert',
      requirements: 938744588795904,
      duration: 2,
      job_location: 'remote',
      domain: 'sdk'
    },
    {
      projectName: 'Wolf',
      postedBy: 'Erdman',
      requirements: 6628640416595968,
      duration: 8,
      job_location: 'on-site',
      domain: 'ai'
    },
    {
      projectName: 'Rempel',
      postedBy: 'Boehm',
      requirements: 7341275711799296,
      duration: 6,
      job_location: 'hybrid',
      domain: 'Electrical'
    },
    {
      projectName: 'Reynolds',
      postedBy: 'Marvin',
      requirements: 6069705984966656,
      duration: 1,
      job_location: 'remote',
      domain: 'sdk'
    },
    {
      projectName: 'Mitchell',
      postedBy: 'Runolfsson',
      requirements: 1819648383254528,
      duration: 5,
      job_location: 'on-site',
      domain: 'ai'
    },
    {
      projectName: 'Bode-Rempel',
      postedBy: 'Lindgren',
      requirements: 2254414175797248,
      duration: 7,
      job_location: 'hybrid',
      domain: 'Electrical'
    }
  ];
  

Project.insertMany(data);
