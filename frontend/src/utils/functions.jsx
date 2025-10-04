import { toast } from 'sonner';
import { useState } from 'react';
import useErrorStore from '../store/errorStore.js';
import api from '../api/axios';
import useDashboardStore from '../store/dashboardStore.js';
import useNotificationStore from '../store/notificationStore.js';

export const fetchOptions = async (endpoint, valueKey, labelKey) => {
  try {
    const res = await api.get(endpoint);

    const data = res.data?.data ?? res.data ?? [];

    return data.map((item) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  } catch (error) {
    console.error('Error fetching options:', error);
    return [];
  }
};

export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error, setError } = useErrorStore();
  const [data, SetData] = useState(null);

  const { fetchDashboardData } = useDashboardStore.getState();
  const { fetchUnreadCount } = useNotificationStore.getState();

  const handleSubmit = async ({
    e,
    isEdit,
    url,
    formData,
    onSuccess,
    onReset,
    showToastError = false,
  }) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await (isEdit
        ? api.put(url, formData)
        : api.post(url, formData));

      const data = res.data;

      if (data) {
        toast.success(data.message);
        onSuccess?.(data.data ?? data);
        onReset?.();
        SetData(data?.data ?? data);

        fetchDashboardData();
        fetchUnreadCount();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          setError(data.errors || data.message);
          if (showToastError) {
            toast.error(
              data.message || `Please check the form for possible errors.`
            );
          }
        } else if (status === 429) {
          toast.error(`${data.message} Try again in a moment.`);
        } else {
          toast.error(data.message || 'Something went wrong.');
        }
      } else {
        toast.error('Network error or server not responding.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting, error, setError, data };
}
