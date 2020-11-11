export default {
  translation: {
    appName: 'TaskManager',
    views: {
      layouts: {
        main: {
          logOut: 'Logout',
          title: 'Taskmanager',
          header: 'TaskManager',
          footer: {
            text: 'Dmitriy Dobrenkiy',
            ghLink: 'My Github',
          },
        },
        inner: {
          logout: 'Logout',
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
          firstName: 'Firstname',
          lastName: 'Lastname',
          email: 'Email',
          password: 'Password',
          add: {
            success: 'Successful registration',
            error: 'Invalid data',
          },
        },
        statuses: {
          title: 'Statuses',
          header: 'Statuses list',
          name: 'Name',
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
            header: 'Create new status',
            error: 'Incorrect data entered',
          },
          delete: {
            success: 'Status delete successfully',
            error: 'Error deleting status',
            errUsed: 'Error: status is used',
          },
          buttonCreate: 'Create new status',
        },
        tasks: {
          title: 'Tasks',
          header: 'Tasks list',
          buttonCreate: 'Create new task',
          name: 'Name',
          label: 'Label',
          labels: 'Labels',
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
          filter: {
            filter: 'Filter',
            clear: 'Clear',
            myTasks: 'My tasks',
          },
        },
        labels: {
          title: 'Labels',
          header: 'Labels list',
          buttonCreate: 'Create new label',
          name: 'Label name:',
          add: {
            header: 'New label',
            title: 'New label',
            success: 'Label created successfully',
            delete: 'Label adding error',
            error: 'Incorrect data entered',
          },
          delete: {
            success: 'Label delete successfully',
            error: 'Error deleting label',
            errUsed: 'Error: label is used',
          },
          edit: {
            header: 'Edit label',
            title: 'Edit label',
            error: 'Label edit error',
            success: 'Label edited successfully',
          },
        },
      },
      messages: {
        notLogged: 'User not logged in. Please login',
      },
    },
    buttons: {
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      submit: 'Submit',
      cancel: 'Cancel',
    },
  },
};
