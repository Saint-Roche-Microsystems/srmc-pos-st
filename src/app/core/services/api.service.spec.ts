import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { API_CONFIG } from '../config/api.config';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = API_CONFIG.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform GET request', () => {
    const mockData = { id: 1, name: 'Test' };

    service.get('test').subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should perform POST request', () => {
    const mockBody = { name: 'New' };
    const mockResponse = { id: 1, name: 'New' };

    service.post('test', mockBody).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should perform PUT request', () => {
    const mockBody = { name: 'Updated' };
    const mockResponse = { id: 1, name: 'Updated' };

    service.put('test/1', mockBody).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should perform PATCH request', () => {
    const mockBody = { name: 'Patched' };
    const mockResponse = { id: 1, name: 'Patched' };

    service.patch('test/1', mockBody).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockBody);
    req.flush(mockResponse);
  });

  it('should perform DELETE request', () => {
    const mockResponse = { success: true };

    service.delete('test/1').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
