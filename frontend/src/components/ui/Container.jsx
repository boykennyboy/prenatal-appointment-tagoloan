import Title from '../Title';

const Container = ({ title, children }) => {
  return (
    <div className='bg-white rounded-lg shadow-md order-1 xl:order-2 min-h-screen'>
      <Title title={title} />
      <div className='p-4 sm:p-6'>{children}</div>
    </div>
  );
};

export default Container;
