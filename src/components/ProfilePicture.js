import React from  'react'

const ProfilePicture = ({ size=100, img, letter }) => (
  <div className="profile-picture" style={{ width: size, height: size }}>
    {/* an alt tag of profile picture is accurate. The warning about duplicate naming is false since the actual name is profile picture; the warning is about appending words such as image/picture to other words, this is not what's done here */}
    {img // eslint-disable-next-line jsx-a11y/img-redundant-alt
      ? <img className="profile-picture-img" src={img} alt="profile picture" />
      : <div className="profile-picture-letter" alt="profile picture (contains first letter of first name)" style={{ lineHeight: size + 'px', fontSize: (size / 2) + 'px' }}>{letter}</div>
    }
  </div>
)

export default ProfilePicture