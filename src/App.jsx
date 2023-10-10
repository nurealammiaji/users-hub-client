import { useState, useEffect } from 'react';
import './App.css'

function App() {

  const [users, setUsers] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Create a User
  const addUser = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    if (name.length > 0 && email.length > 0) {
      const user = { name, email }
      console.log(user);
      fetch('https://users-hub-server.vercel.app/users', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.insertedId) {
            alert("User added successfully !!");
            form.reset();
          }
        })
        .catch(error => {
          console.error('Error:', error);
        })

    }
    else {
      alert("Please fill Name and Email field !!");
      return;
    }
  }

  // Read a User
  useEffect(() => {
    fetch('https://users-hub-server.vercel.app/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(error => console.error(error))
  })

  // Load Specific User
  const loadSpecificUser = (_id) => {
    const specificUser = users.find(user => user._id === _id);
    setUserDetails(specificUser);
    document.getElementById('my_modal_5').showModal()
  }

  // Update a User
  const updateUser = (event) => {
    event.preventDefault();
    const form = event.target;
    const _id = form.id.value;
    const name = form.name.value;
    const email = form.email.value;
    const user = { _id, name, email };
    console.log(user);
    fetch('https://users-hub-server.vercel.app/users', {
      method: 'PUT',
      headers: {
        'content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.modifiedCount > 0) {
          alert("User updated successfully !!");
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  // Delete a User
  const deleteUser = (_id) => {
    console.log("delete", _id);
    fetch(`https://users-hub-server.vercel.app/users/${_id}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.deletedCount > 0) {
          alert("User deleted successfully !!")
        }
      })
      .catch(error => {
        console.error(error);
      })
  }

  return (
    <>
      <h3 className='text-5xl font-bold'>User's Hub</h3>
      <br /><br />
      <div className="hero bg-base-200">
        <div className="grid gap-10 p-20 md:grid-cols-2">
          <div className="w-full max-w-sm shadow-2xl card bg-base-100">
            <form onSubmit={addUser} className="card-body">
              <h5 className='text-2xl font-semibold divider'>Add User</h5>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input type="text" placeholder="Name" name="name" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="text" placeholder="Email" name="email" className="input input-bordered" />
              </div>
              <div className="mt-6 form-control">
                <button type="submit" className="btn btn-primary">Add User</button>
              </div>
            </form>
          </div>
          <div className="text-center">
            <h1 className="mb-5 text-2xl font-bold underline">User's List :</h1>
            <ol className='text-left list-decimal'>
              {
                (users !== null) ?
                  users.map(user => <li className='my-3' key={user._id}><span className='font-medium'>Name:</span> {user.name}, <span className='font-medium'>Email:</span> {user.email}
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" >
                      <form onSubmit={updateUser} className="text-center modal-box">
                        <div className="modal-action">
                          <form method="dialog">
                            <button className="absolute btn btn-sm btn-ghost btn-circle right-2 top-2">✕</button>
                          </form>
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">ID</span>
                          </label>
                          <input type="text" defaultValue={userDetails?._id} name="id" className="input input-bordered" disabled />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Name</span>
                          </label>
                          <input type="text" defaultValue={userDetails?.name} name="name" className="input input-bordered" />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Email</span>
                          </label>
                          <input type="text" defaultValue={userDetails?.email} name="email" className="input input-bordered" />
                        </div>
                        <div className="mt-6 form-control">
                          <button className="btn btn-primary">Update User</button>
                        </div>
                      </form>
                    </dialog >
                    <button className="px-1 mx-2 font-semibold text-green-600 border border-green-600 rounded-full bg-base-100" onClick={() => loadSpecificUser(user._id)}>Edit</button>
                    <button onClick={() => deleteUser(user._id)} className='px-1 font-semibold text-red-600 border border-red-600 rounded-full shadow-2xl bg-base-100'>X</button></li>) :
                  <h3 className='text-center'>User's will be loaded here ...</h3>
              }
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
