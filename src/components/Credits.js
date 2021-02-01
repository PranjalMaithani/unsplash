import styled from "styled-components";
import { css } from "styled-components";

const creditsDiv = css`
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LinkStyle = styled.a`
  text-decoration: none;
  outline: none;
`;

const CreditsDivAbsolute = styled.div`
  ${creditsDiv}
  position: absolute;
  bottom: 20px;
  left: 10px;
  width: 100%;
`;

const CreditsDivHeader = styled.div`
  ${creditsDiv}
  width: auto;
  padding: 10px;
`;

const CreditsNamesDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreditsPhoto = styled.img`
  border-radius: 50%;
  margin: 0 10px;
`;

const creditsName = css`
  font-size: 15px;
  font-weight: 600;
`;

const CreditsNameOnDark = styled.a`
  ${creditsName}
  color: white;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.8;
  transition: 0.1s;

  &:hover {
    opacity: 1;
  }
`;

const CreditsNameOnLight = styled.a`
  ${creditsName}
  color: black;
`;

const UserTag = styled.a`
  opacity: 0.7;
  color: black;
  font-size: 12px;

  &:hover {
    opacity: 1;
  }
`;

const LinkTag = ({ children, href }) => (
  <LinkStyle href={href} target="_blank" rel="noreferrer noopener">
    {children}
  </LinkStyle>
);

const getUserLink = (image) => {
  return `https://unsplash.com/@${image.user.username}`;
};

export const CreditsImage = ({ image }) => {
  if (!image) {
    return null;
  }

  const portfolioLink = getUserLink(image);

  return (
    <CreditsDivAbsolute
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <LinkTag href={portfolioLink}>
        <CreditsPhoto
          src={image.user.profile_image.small}
          alt="Photographer profile picture"
        />
      </LinkTag>

      <LinkTag href={portfolioLink}>
        <CreditsNameOnDark
          children={
            image.user.first_name +
            " " +
            (image.user.last_name ? image.user.last_name : "")
          }
        />
      </LinkTag>
    </CreditsDivAbsolute>
  );
};

export const CreditsHeader = ({ image }) => {
  if (!image) {
    return null;
  }

  const portfolioLink = getUserLink(image);
  return (
    <div>
      <CreditsDivHeader>
        <LinkTag href={portfolioLink}>
          <CreditsPhoto
            src={image.user.profile_image.small}
            alt="Photographer profile picture"
          />
        </LinkTag>

        <LinkTag href={portfolioLink}>
          <CreditsNamesDiv>
            <CreditsNameOnLight
              children={
                image.user.first_name +
                " " +
                (image.user.last_name ? image.user.last_name : "")
              }
            />
            <UserTag children={"@" + image.user.username} />
          </CreditsNamesDiv>
        </LinkTag>
      </CreditsDivHeader>
    </div>
  );
};
