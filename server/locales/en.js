export default {
  translation: {
    appName: 'TaskManager',
    views: {
      layouts: {
        main: {
          logOut: 'Logout',
          title: 'Taskmanager',
          footer: {
            text: 'Dmitriy Dobrenkiy',
            ghLink: 'My Github',
          },
        },
      },
      pages: {
        startPage: {
          notLoggedButton: 'Get started',
          loggedButton: 'Go to tasks!',
          greeting: 'Welcome!',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        login: {
          title: 'Login',
          email: 'Email:',
          password: 'Password:',
          notRegistered: 'Not registered?',
        },
        signup: {
          title: 'Register',
          email: 'Email:',
          password: 'Password:',
          firstName: 'Firstname:',
          lastName: 'Lastname:',
          registered: 'Already registered?',
        },
        users: {
          title: 'Users',
          header: 'Users list',
          warning: 'User will be deleted!',
          edit: {
            title: 'Edit user',
            header: 'Edit user: ',
            submit: 'Update',
            cancel: 'Cancel',
            success: 'User successfully edited',
            error: 'User edit error',
          },
          add: {
            success: 'Successful registration',
            error: 'Invalid data',
          },
        },
        statuses: {
          title: 'Statuses',
          header: 'Statuses list',
          form: {
            name: 'Name:',
            placeholderName: 'Enter name',
          },
          edit: {
            title: 'Edit status',
            success: 'Status successfully edited',
            error: 'Status edit error',
          },
          add: {
            title: 'New status',
            success: 'Status successfully added',
            error: 'Error adding status',
            header: 'Create new status',
          },
          delete: {
            success: 'Status delete successfully',
            error: 'Error deleting status',
          },
          buttonCreate: 'Create new status',
        },
        tasks: {
          title: 'Tasks',
          header: 'Tasks list',
          buttonCreate: 'Create new task',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          creator: 'Creator',
          executor: 'Executor',
          add: {
            title: 'New task',
            success: 'Task created successfully',
            error: 'Task adding error',
          },
          edit: {
            title: 'Edit task',
            success: 'Task successfully edited',
            error: 'Task edit error',
            header: 'Edit task',
          },
          delete: {
            success: 'Task delete successfully',
            error: 'Error deleting task',
          },
        },
      },
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
};
