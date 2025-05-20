import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    
    // Fetch users with all their tests
    const users = await db.collection('myusers')
      .find({})
      .project({
        armyNo: 1,
        name: 1,
        batchnumber: 1,
        bcmTests: 1, // Now shows all BCM tests
        bdmTests: 1, // Now shows all BDM tests
        bpetTests: 1, // Now shows all BPET tests
        pptTests: 1, // Now shows all PPT tests
        createdAt: 1,
        rank: 1,
        profileimage: 1,
        updatedAt: 1
      })
      .toArray();
    
    await client.close();

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message
    });
  }
}