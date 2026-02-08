import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import BasicLayout from './layouts/BasicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardIndex from './pages/dashboard/DashboardIndex.jsx';
import WorkerHome from './pages/dashboard/WorkerHome.jsx';
import TaskList from './pages/dashboard/TaskList.jsx';
import TaskDetails from './pages/dashboard/TaskDetails.jsx';
import MySubmissions from './pages/dashboard/MySubmissions.jsx';
import Withdrawals from './pages/dashboard/Withdrawals.jsx';
import BuyerHome from './pages/dashboard/BuyerHome.jsx';
import AddTask from './pages/dashboard/AddTask.jsx';
import MyTasks from './pages/dashboard/MyTasks.jsx';
import TasksToReview from './pages/dashboard/TasksToReview.jsx';
import PurchaseCoin from './pages/dashboard/PurchaseCoin.jsx';
import PaymentHistory from './pages/dashboard/PaymentHistory.jsx';
import AdminHome from './pages/dashboard/AdminHome.jsx';
import ManageUsers from './pages/dashboard/ManageUsers.jsx';
import ManageTasks from './pages/dashboard/ManageTasks.jsx';
import WithdrawRequests from './pages/dashboard/WithdrawRequests.jsx';
import Reports from './pages/dashboard/Reports.jsx';
import Profile from './pages/dashboard/Profile.jsx';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BasicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardIndex />} />
            <Route path="worker-home" element={<PrivateRoute allowedRoles={['worker']}><WorkerHome /></PrivateRoute>} />
            <Route path="task-list" element={<PrivateRoute allowedRoles={['worker']}><TaskList /></PrivateRoute>} />
            <Route path="task-details/:id" element={<PrivateRoute allowedRoles={['worker']}><TaskDetails /></PrivateRoute>} />
            <Route path="my-submissions" element={<PrivateRoute allowedRoles={['worker']}><MySubmissions /></PrivateRoute>} />
            <Route path="withdrawals" element={<PrivateRoute allowedRoles={['worker']}><Withdrawals /></PrivateRoute>} />
            <Route path="buyer-home" element={<PrivateRoute allowedRoles={['buyer']}><BuyerHome /></PrivateRoute>} />
            <Route path="add-task" element={<PrivateRoute allowedRoles={['buyer']}><AddTask /></PrivateRoute>} />
            <Route path="my-tasks" element={<PrivateRoute allowedRoles={['buyer']}><MyTasks /></PrivateRoute>} />
            <Route path="tasks-to-review" element={<PrivateRoute allowedRoles={['buyer']}><TasksToReview /></PrivateRoute>} />
            <Route path="purchase-coin" element={<PrivateRoute allowedRoles={['buyer']}><PurchaseCoin /></PrivateRoute>} />
            <Route path="payment-history" element={<PrivateRoute allowedRoles={['buyer', 'worker']}><PaymentHistory /></PrivateRoute>} />
            <Route path="admin-home" element={<PrivateRoute allowedRoles={['admin']}><AdminHome /></PrivateRoute>} />
            <Route path="manage-users" element={<PrivateRoute allowedRoles={['admin']}><ManageUsers /></PrivateRoute>} />
            <Route path="manage-tasks" element={<PrivateRoute allowedRoles={['admin']}><ManageTasks /></PrivateRoute>} />
            <Route path="withdraw-requests" element={<PrivateRoute allowedRoles={['admin']}><WithdrawRequests /></PrivateRoute>} />
            <Route path="reports" element={<PrivateRoute allowedRoles={['admin']}><Reports /></PrivateRoute>} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
