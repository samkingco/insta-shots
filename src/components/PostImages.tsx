import { css } from "@emotion/core";
import styled from "@emotion/styled";

interface PostImage {
  src: string;
  name: string;
  width: number;
  height: number;
}

interface Props {
  postImages: PostImage[];
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  > * {
    grid-column: 1 / -1;
  }
`;

const ScrollWrapper = styled.div<{ childrenCount: number }>(
  (p) => css`
    display: grid;
    grid-gap: 24px;
    grid-template-columns: 1px repeat(${p.childrenCount}, minmax(300px, 1fr)) 1px;
    align-items: center;

    padding-top: 24px;
    padding-bottom: 24px;

    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;

    &:before,
    &:after {
      content: "i";
      color: transparent;
    }
  `
);

const ImageWrapper = styled.div`
  line-height: 0;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.16);
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

export function PostImages({ postImages }: Props) {
  return (
    <Wrapper>
      <ScrollWrapper childrenCount={postImages.length}>
        {postImages.map((image) =>
          image.src ? (
            <ImageWrapper key={image.name}>
              <Image
                key={image.name}
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.name}
              />
            </ImageWrapper>
          ) : null
        )}
      </ScrollWrapper>
    </Wrapper>
  );
}
