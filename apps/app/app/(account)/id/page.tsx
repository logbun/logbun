const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsgdgay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindgdfgsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsadfgy Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Lindsagdfy Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
];

function ProjectId() {
  return (
    <div className="flex-grow h-full bg-white shadow-md shadow-gray-300/50 sm:rounded-lg">
      <div className="px-6 py-2 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-lg font-semibold leading-tight tracking-tight text-gray-900">Issues</h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block px-3 py-2 text-sm font-semibold text-center text-white rounded-md shadow-sm bg-gray-600 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-gray-200 bg-gray-50 border-y">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-xs font-semibold tracking-wider text-left uppercase text-gray-500 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-semibold tracking-wider text-left uppercase text-gray-500"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-semibold tracking-wider text-left uppercase text-gray-500"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-semibold tracking-wider text-left uppercase text-gray-500"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {people.map((person) => (
                    <tr key={person.name}>
                      <td className="py-3.5 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                        {person.name}
                      </td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 whitespace-nowrap">{person.title}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 whitespace-nowrap">{person.email}</td>
                      <td className="px-3 py-3.5 text-sm text-gray-500 whitespace-nowrap">{person.role}</td>
                      <td className="relative py-3.5 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <a href="#" className="text-gray-600 hover:text-gray-900">
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Project() {
  return (
    <div className="flex flex-col flex-grow pb-8">
      <header className="flex items-center flex-shrink-0 h-16">
        <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-700">Issues</h1>
      </header>
      <main className="flex-grow">
        <ProjectId />
      </main>
    </div>
  );
}
