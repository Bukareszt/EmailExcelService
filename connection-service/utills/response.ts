import {
  IObjectWithInformationAboutEmailAndValue,
  IResponse,
} from '../InterfacesAndTypes';

export function createResponse(msg: string, statusCode: number): IResponse {
  const response: IResponse = {
    msg,
    statusCode,
  };
  return response;
}

export function prepareResponseBasedOnInformation(
  informationAboutOperations: IObjectWithInformationAboutEmailAndValue
): IResponse {
  if (!informationAboutOperations.emailAlreadyExist) {
    return createResponse(
      'Your email has been added to the list of subscribers!',
      200
    );
  } else if (
    informationAboutOperations.emailAlreadyExist &&
    !informationAboutOperations.valueAlreadyExist
  ) {
    return createResponse('Your tags has been updated!', 200);
  } else {
    return createResponse('Nothing changed!', 200);
  }
}
