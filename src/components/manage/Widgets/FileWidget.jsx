/**
 * FileWidget component.
 * @module components/manage/Widgets/FileWidget
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Image } from 'semantic-ui-react';
import { readAsDataURL } from 'promise-file-reader';
import { injectIntl } from 'react-intl';
import deleteSVG from '@plone/volto/icons/delete.svg';
import { Icon, FormFieldWrapper } from '@plone/volto/components';

const imageMimetypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/jpg',
  'image/gif',
  'image/svg+xml',
];

/**
 * FileWidget component class.
 * @function FileWidget
 * @returns {string} Markup of the component.
 */
const FileWidget = (props) => {
  const { id, value, onChange } = props;
  const fileInput = React.useRef(null);
  const [fileType, setFileType] = React.useState(true);

  return (
    <FormFieldWrapper {...props}>
      {fileType ? (
        <Image
          className="image-preview"
          id={`field-${id}-image`}
          size="small"
        />
      ) : null}
      <Input
        id={`field-${id}`}
        name={id}
        type="file"
        ref={fileInput}
        disabled={props.isDisabled}
        onChange={({ target }) => {
          const file = target.files[0];
          readAsDataURL(file).then((data) => {
            const fields = data.match(/^data:(.*);(.*),(.*)$/);
            onChange(id, {
              data: fields[3],
              encoding: fields[2],
              'content-type': fields[1],
              filename: file.name,
            });
          });

          let reader = new FileReader();
          reader.onload = function () {
            const fields = reader.result.match(/^data:(.*);(.*),(.*)$/);
            if (imageMimetypes.includes(fields[1])) {
              setFileType(true);
              let imagePreview = document.getElementById(`field-${id}-image`);
              imagePreview.src = reader.result;
            } else {
              setFileType(false);
            }
          };
          reader.readAsDataURL(target.files[0]);
        }}
      />
      <div className="field-file-name">
        {value && value.filename}
        {value && (
          <Button
            icon
            basic
            className="delete-button"
            aria-label="delete file"
            onClick={() => {
              onChange(id, null);
              setFileType(false);
              fileInput.current.inputRef.current.value = null;
            }}
          >
            <Icon name={deleteSVG} size="20px" />
          </Button>
        )}
      </div>
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
FileWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.shape({
    '@type': PropTypes.string,
    title: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  wrapped: PropTypes.bool,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
FileWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
};

export default injectIntl(FileWidget);
