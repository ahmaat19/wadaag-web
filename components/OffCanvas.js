import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FaTimesCircle, FaCheckCircle, FaLevelUpAlt } from 'react-icons/fa'
import useProfilesHook from '../utils/api/profiles'
import { customLocalStorage } from '../utils/customLocalStorage'
import Image from 'next/image'
import { Spinner } from './Spinner'
import Message from './Message'

const OffCanvas = () => {
  const { getProfile } = useProfilesHook({
    page: 1,
    q: '',
    limit: 25,
  })

  const { data, isLoading, isError, error } = getProfile

  const user = () => {
    const userInfo =
      customLocalStorage() &&
      customLocalStorage().userInfo &&
      customLocalStorage().userInfo

    return userInfo
  }

  const menus = () => {
    const dropdownItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route.menu
      )

    const menuItems =
      customLocalStorage() &&
      customLocalStorage().userAccessRoutes &&
      customLocalStorage().userAccessRoutes.clientPermission &&
      customLocalStorage().userAccessRoutes.clientPermission.map(
        (route) => route
      )

    const dropdownArray =
      dropdownItems &&
      dropdownItems.filter((item) => item !== 'hidden' && item !== 'normal')

    const uniqueDropdowns = [...new Set(dropdownArray)]

    return { uniqueDropdowns, menuItems }
  }

  const authItems = () => {
    return (
      <>
        <ul className='navbar-nav ms-auto'>
          {menus() &&
            menus().menuItems.map(
              (menu) =>
                menu.menu === 'normal' &&
                menu.auth === true && (
                  <li
                    key={menu._id}
                    className='nav-item'
                    data-bs-dismiss='offcanvas'
                    aria-label='Close'
                  >
                    <Link href={menu.path}>
                      <a className='nav-link' aria-current='page'>
                        {menu.name}
                      </a>
                    </Link>
                  </li>
                )
            )}

          {menus() &&
            menus().uniqueDropdowns.map((item) => (
              <li key={item} className='nav-item dropdown'>
                <a
                  className='nav-link dropdown-toggle'
                  href='#'
                  id='navbarDropdownMenuLink'
                  role='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {item === 'profile'
                    ? user() && user().name
                    : item.charAt(0).toUpperCase() + item.substring(1)}
                </a>
                <ul
                  className='dropdown-menu border-0'
                  aria-labelledby='navbarDropdownMenuLink'
                >
                  {menus() &&
                    menus().menuItems.map(
                      (menu) =>
                        menu.menu === item && (
                          <li
                            key={menu._id}
                            data-bs-dismiss='offcanvas'
                            aria-label='Close'
                          >
                            <Link href={menu.path}>
                              <a
                                className='dropdown-item'
                                style={{ fontSize: '0.9rem' }}
                              >
                                {menu.name}
                              </a>
                            </Link>
                          </li>
                        )
                    )}
                </ul>
              </li>
            ))}
        </ul>
      </>
    )
  }

  return (
    <div
      className='offcanvas offcanvas-start border-0'
      tabIndex='-1'
      id='offcanvasExample'
      aria-labelledby='offcanvasExampleLabel'
    >
      <div className='offcanvas-header bg-primary py-1 h-25'>
        {isLoading && <Spinner />}
        {isError && <Message variant='danger'>{error}</Message>}
        {data && (
          <div className='text-center mx-auto' id='offcanvasExampleLabel'>
            <Link href='/account/profile'>
              <a>
                <Image
                  priority
                  width='60'
                  height='60'
                  src={data.image}
                  className='img-fluid rounded-pill text-center'
                  alt='logo'
                />
              </a>
            </Link>

            <div className='info'>
              <span className='text-white'>
                {data.name || 'User'}
                <FaCheckCircle className='text-success mb-1 ms-1' />
              </span>
              <div className='text-white'>
                <span className='text-muted'>{data.type}</span> <br />
                {data.type === 'driver' && (
                  <div className='btn-group'>
                    <button className='btn btn-sm btn-outline-light'>
                      Points: {data.points}
                    </button>
                    <button className='btn btn-sm btn-outline-light'>
                      Level {data.level || 1}
                      <FaLevelUpAlt className='mb-1 text-success' />
                    </button>
                  </div>
                )}
                {data.type === 'rider' && (
                  <button
                    className={`btn btn-sm mt-1 w-100 ${
                      data.expiration < 10
                        ? 'btn-outline-danger'
                        : data.expiration < 20
                        ? 'btn-outline-warning'
                        : 'btn-outline-light'
                    }`}
                  >
                    Expiration: {data.expiration} days
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <FaTimesCircle
          className='text-light fs-4 position-absolute top-0 end-0 m-2'
          data-bs-dismiss='offcanvas'
          aria-label='Close'
          id='offcanvas-toggle'
        />
      </div>
      <div className='offcanvas-body'>{authItems()}</div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(OffCanvas), { ssr: false })